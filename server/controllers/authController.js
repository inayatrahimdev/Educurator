/**
 * Authentication Controller
 * Handles user registration and login
 */

const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { generateToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Format validation errors for frontend
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMessages,
                errors: errors.array()
            });
        }

        const { name, email, password, preferences } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM Users WHERE email = @email',
            { email }
        );

        if (existingUser.recordset && existingUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Default preferences if not provided
        const userPreferences = preferences || {
            interests: [],
            difficulty: 'beginner',
            language: 'en'
        };

        // Insert new user
        const result = await query(
            `INSERT INTO Users (name, email, password, preferences)
             OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.preferences
             VALUES (@name, @email, @password, @preferences)`,
            {
                name,
                email,
                password: hashedPassword,
                preferences: JSON.stringify(userPreferences)
            }
        );

        // Check if user was created successfully
        if (!result || !result.recordset || result.recordset.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create user. Please try again.'
            });
        }

        const user = result.recordset[0];

        // Validate user data
        if (!user || !user.id || !user.email) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve created user data. Please try again.'
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    preferences: user.preferences ? JSON.parse(user.preferences) : userPreferences
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        // Handle database errors
        if (error.code === 'EREQUEST') {
            return res.status(500).json({
                success: false,
                message: 'Database error occurred. Please try again.'
            });
        }
        // Handle other errors
        return res.status(500).json({
            success: false,
            message: error.message || 'Registration failed. Please try again.'
        });
    }
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Format validation errors for frontend
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMessages,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const result = await query(
            'SELECT id, name, email, password, preferences FROM Users WHERE email = @email',
            { email }
        );

        // Check if user exists
        if (!result || !result.recordset || result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.recordset[0];

        // Check if user has a password (should always be true, but safety check)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    preferences: user.preferences ? JSON.parse(user.preferences) : null
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Login failed. Please try again.'
        });
    }
});

/**
 * Get current user profile
 * GET /api/auth/me
 * Protected route
 */
const getMe = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const result = await query(
        'SELECT id, name, email, preferences FROM Users WHERE id = @userId',
        { userId }
    );

    if (result.recordset.length === 0) {
        return next(new AppError('User not found', 404));
    }

    const user = result.recordset[0];

    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                preferences: user.preferences ? JSON.parse(user.preferences) : null
            }
        }
    });
});

module.exports = {
    register,
    login,
    getMe
};

