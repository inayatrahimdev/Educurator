/**
 * Course Routes
 * Handles course-related endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getRecommendations,
    enrollCourse,
    updateProgress
} = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/auth');

// Validation rules for course creation/update
const courseValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];

// Public routes
router.get('/', getCourses); // Get all courses (with optional search/tags)

// Protected routes (require authentication)
// NOTE: More specific routes must come before parameterized routes
router.get('/recommendations/list', authenticateToken, getRecommendations);
router.get('/:id', authenticateToken, getCourseById); // Get single course (auth for progress tracking)
router.post('/', authenticateToken, courseValidation, createCourse);
router.put('/:id', authenticateToken, courseValidation, updateCourse);
router.delete('/:id', authenticateToken, deleteCourse);
router.post('/:id/enroll', authenticateToken, enrollCourse);
router.put('/:id/progress', authenticateToken, updateProgress);

module.exports = router;

