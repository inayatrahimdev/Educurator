/**
 * Personalization Routes
 * Handles AI-powered personalized learning features
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getRecommendations,
    getProgressAnalysis,
    getLearningQuestions
} = require('../controllers/personalizationController');

// All routes require authentication
router.get('/recommendations', authenticateToken, getRecommendations);
router.get('/progress-analysis', authenticateToken, getProgressAnalysis);
router.get('/questions/:courseId', authenticateToken, getLearningQuestions);

module.exports = router;

