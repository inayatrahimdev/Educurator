/**
 * Module Routes
 * Handles module-related endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createModule,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');
const { authenticateToken } = require('../middleware/auth');

// Validation rules for module creation/update
const moduleValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('content')
        .optional()
        .trim()
        .isLength({ max: 10000 })
        .withMessage('Content must be less than 10000 characters'),
    body('orderIndex')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order index must be a non-negative integer')
];

// All routes require authentication
router.post('/courses/:courseId/modules', authenticateToken, moduleValidation, createModule);
router.put('/:id', authenticateToken, moduleValidation, updateModule);
router.delete('/:id', authenticateToken, deleteModule);

module.exports = router;

