/**
 * User Routes
 * Handles user profile and progress endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProfile,
    updateProfile,
    getProgress,
    getNotifications,
    markNotificationRead
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Validation rules for profile update
const profileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('preferences')
        .optional()
        .isObject()
        .withMessage('Preferences must be an object')
];

// All routes require authentication
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, profileValidation, updateProfile);
router.get('/progress', authenticateToken, getProgress);
router.get('/notifications', authenticateToken, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);

module.exports = router;

