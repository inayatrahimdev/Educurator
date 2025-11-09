/**
 * User Controller
 * Handles user profile and progress operations
 */

const { query } = require('../db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

/**
 * Get user profile
 * GET /api/users/profile
 * Protected route - requires authentication
 */
const getProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const result = await query(
        'SELECT id, name, email, preferences FROM Users WHERE id = @userId',
        { userId }
    );

    if (result.recordset.length === 0) {
        return next(new AppError('User not found', 404));
    }

    const user = result.recordset[0];
    user.preferences = user.preferences ? JSON.parse(user.preferences) : null;

    res.json({
        success: true,
        data: { user }
    });
});

/**
 * Update user profile
 * PUT /api/users/profile
 * Protected route - requires authentication
 */
const updateProfile = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const userId = req.user.id;
    const { name, preferences } = req.body;

    // Build update query dynamically
    const updates = [];
    const params = { userId };

    if (name) {
        updates.push('name = @name');
        params.name = name;
    }
    if (preferences) {
        updates.push('preferences = @preferences');
        params.preferences = JSON.stringify(preferences);
    }

    if (updates.length === 0) {
        return next(new AppError('No fields to update', 400));
    }

    const sqlQuery = `
    UPDATE Users 
    SET ${updates.join(', ')}
    OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.preferences
    WHERE id = @userId
  `;

    const result = await query(sqlQuery, params);
    const user = result.recordset[0];
    user.preferences = user.preferences ? JSON.parse(user.preferences) : null;

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
    });
});

/**
 * Get user progress for all enrolled courses
 * GET /api/users/progress
 * Protected route - requires authentication
 */
const getProgress = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const result = await query(
        `SELECT 
      c.id as courseId,
      c.title as courseTitle,
      c.description as courseDescription,
      uc.progress,
      uc.lastVisited,
      (SELECT COUNT(*) FROM Modules WHERE courseId = c.id) as totalModules
    FROM UserCourses uc
    INNER JOIN Courses c ON uc.courseId = c.id
    WHERE uc.userId = @userId
    ORDER BY uc.lastVisited DESC`,
        { userId }
    );

    const progress = result.recordset.map(row => ({
        courseId: row.courseId,
        courseTitle: row.courseTitle,
        courseDescription: row.courseDescription,
        progress: row.progress,
        lastVisited: row.lastVisited,
        totalModules: row.totalModules
    }));

    res.json({
        success: true,
        count: progress.length,
        data: { progress }
    });
});

/**
 * Get user notifications
 * GET /api/users/notifications
 * Protected route - requires authentication
 */
const getNotifications = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { status } = req.query;

    let sqlQuery = `
    SELECT id, userId, message, status, createdAt
    FROM Notifications
    WHERE userId = @userId
  `;
    const params = { userId };

    if (status) {
        sqlQuery += ' AND status = @status';
        params.status = status;
    }

    sqlQuery += ' ORDER BY createdAt DESC';

    const result = await query(sqlQuery, params);

    res.json({
        success: true,
        count: result.recordset.length,
        data: { notifications: result.recordset }
    });
});

/**
 * Mark notification as read
 * PUT /api/users/notifications/:id/read
 * Protected route - requires authentication
 */
const markNotificationRead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if notification exists and belongs to user
    const notificationResult = await query(
        'SELECT id FROM Notifications WHERE id = @id AND userId = @userId',
        { id, userId }
    );

    if (notificationResult.recordset.length === 0) {
        return next(new AppError('Notification not found', 404));
    }

    // Update notification status
    await query(
        'UPDATE Notifications SET status = @status WHERE id = @id',
        { id, status: 'read' }
    );

    res.json({
        success: true,
        message: 'Notification marked as read'
    });
});

module.exports = {
    getProfile,
    updateProfile,
    getProgress,
    getNotifications,
    markNotificationRead
};

