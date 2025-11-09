/**
 * Personalization Controller
 * Handles personalized learning recommendations and AI-powered features
 */

const { query } = require('../db');
const { asyncHandler } = require('../middleware/errorHandler');
const {
    getPersonalizedRecommendations,
    analyzeProgress,
    generateLearningQuestions
} = require('../services/openaiService');

/**
 * Get personalized course recommendations
 * GET /api/personalization/recommendations
 */
const getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get user profile
    const userResult = await query(
        'SELECT id, name, email, preferences FROM Users WHERE id = @userId',
        { userId }
    );

    if (userResult.recordset.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const user = userResult.recordset[0];
    const preferences = user.preferences ? JSON.parse(user.preferences) : {};
    const userProfile = {
        interests: preferences.interests || [],
        difficulty: preferences.difficulty || 'beginner',
        goals: preferences.goals || [],
        currentSkills: preferences.currentSkills || []
    };

    // Get available courses
    const coursesResult = await query(
        'SELECT id, title, description, tags, category FROM Courses ORDER BY createdAt DESC'
    );

    const courses = coursesResult.recordset.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        tags: course.tags ? JSON.parse(course.tags) : [],
        category: course.category
    }));

    // Get personalized recommendations
    const recommendations = await getPersonalizedRecommendations(userProfile, courses);

    // Get user's enrolled courses
    const enrolledResult = await query(
        `SELECT c.id, c.title, c.description, c.tags, uc.progress 
         FROM UserCourses uc
         JOIN Courses c ON uc.courseId = c.id
         WHERE uc.userId = @userId
         ORDER BY uc.lastVisited DESC`,
        { userId }
    );

    const enrolledCourses = enrolledResult.recordset.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        tags: course.tags ? JSON.parse(course.tags) : [],
        progress: course.progress
    }));

    res.json({
        success: true,
        data: {
            recommendations,
            enrolledCourses,
            userProfile
        }
    });
});

/**
 * Analyze user progress and get personalized feedback
 * GET /api/personalization/progress-analysis
 */
const getProgressAnalysis = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get user profile
    const userResult = await query(
        'SELECT id, name, email, preferences FROM Users WHERE id = @userId',
        { userId }
    );

    if (userResult.recordset.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const user = userResult.recordset[0];
    const preferences = user.preferences ? JSON.parse(user.preferences) : {};

    // Get user progress
    const progressResult = await query(
        `SELECT 
            COUNT(*) as totalCourses,
            AVG(progress) as averageProgress,
            SUM(CASE WHEN progress = 100 THEN 1 ELSE 0 END) as completedCourses,
            MAX(lastVisited) as lastActivity
         FROM UserCourses
         WHERE userId = @userId`,
        { userId }
    );

    const progress = progressResult.recordset[0];

    // Get course details
    const coursesResult = await query(
        `SELECT c.title, uc.progress, uc.lastVisited
         FROM UserCourses uc
         JOIN Courses c ON uc.courseId = c.id
         WHERE uc.userId = @userId
         ORDER BY uc.progress DESC, uc.lastVisited DESC`,
        { userId }
    );

    const userProgress = {
        totalCourses: progress.totalCourses || 0,
        averageProgress: Math.round(progress.averageProgress || 0),
        completedCourses: progress.completedCourses || 0,
        lastActivity: progress.lastActivity,
        courses: coursesResult.recordset
    };

    const userProfile = {
        difficulty: preferences.difficulty || 'beginner',
        goals: preferences.goals || [],
        interests: preferences.interests || [],
        currentSkills: preferences.currentSkills || []
    };

    // Get AI analysis
    const analysis = await analyzeProgress(userProgress, userProfile);

    res.json({
        success: true,
        data: {
            progress: userProgress,
            analysis,
            userProfile
        }
    });
});

/**
 * Get personalized learning questions for a course
 * GET /api/personalization/questions/:courseId
 */
const getLearningQuestions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Get course
    const courseResult = await query(
        'SELECT id, title, description, tags FROM Courses WHERE id = @courseId',
        { courseId }
    );

    if (courseResult.recordset.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }

    const course = courseResult.recordset[0];
    course.tags = course.tags ? JSON.parse(course.tags) : [];

    // Get user profile
    const userResult = await query(
        'SELECT preferences FROM Users WHERE id = @userId',
        { userId }
    );

    const preferences = userResult.recordset[0]?.preferences 
        ? JSON.parse(userResult.recordset[0].preferences) 
        : {};

    const userProfile = {
        difficulty: preferences.difficulty || 'beginner',
        goals: preferences.goals || [],
        interests: preferences.interests || []
    };

    // Get personalized questions
    const questions = await generateLearningQuestions(course, userProfile);

    res.json({
        success: true,
        data: {
            questions,
            course: {
                id: course.id,
                title: course.title
            }
        }
    });
});

module.exports = {
    getRecommendations,
    getProgressAnalysis,
    getLearningQuestions
};

