/**
 * Course Controller
 * Handles CRUD operations for courses and modules
 */

const { query } = require('../db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

/**
 * Get all courses with optional filtering
 * GET /api/courses
 */
const getCourses = asyncHandler(async (req, res, next) => {
    const { search, tags, category, difficulty } = req.query;
    let sqlQuery = 'SELECT id, title, description, tags, category, difficulty, duration, careerOpportunities, createdAt FROM Courses WHERE 1=1';
    const params = {};
    
    // Add category filter
    if (category) {
        sqlQuery += ' AND category = @category';
        params.category = category;
    }
    
    // Add difficulty filter
    if (difficulty) {
        sqlQuery += ' AND difficulty = @difficulty';
        params.difficulty = difficulty;
    }

    // Add search filter
    if (search) {
        sqlQuery += ' AND (title LIKE @search OR description LIKE @search)';
        params.search = `%${search}%`;
    }

    // Add tags filter
    if (tags) {
        const tagArray = tags.split(',');
        sqlQuery += ' AND (';
        tagArray.forEach((tag, index) => {
            if (index > 0) sqlQuery += ' OR ';
            sqlQuery += `tags LIKE @tag${index}`;
            params[`tag${index}`] = `%${tag}%`;
        });
        sqlQuery += ')';
    }

    sqlQuery += ' ORDER BY createdAt DESC';

    const result = await query(sqlQuery, params);

    // Parse JSON fields for each course
    const courses = result.recordset.map(course => ({
        ...course,
        tags: course.tags ? JSON.parse(course.tags) : [],
        careerOpportunities: course.careerOpportunities ? JSON.parse(course.careerOpportunities) : []
    }));

    res.json({
        success: true,
        count: courses.length,
        data: { courses }
    });
});

/**
 * Get single course by ID with modules
 * GET /api/courses/:id
 */
const getCourseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get course
    const courseResult = await query(
        'SELECT id, title, description, tags, category, difficulty, duration, careerOpportunities, createdAt FROM Courses WHERE id = @id',
        { id }
    );

    if (courseResult.recordset.length === 0) {
        return next(new AppError('Course not found', 404));
    }

    const course = courseResult.recordset[0];
    course.tags = course.tags ? JSON.parse(course.tags) : [];
    course.careerOpportunities = course.careerOpportunities ? JSON.parse(course.careerOpportunities) : [];

    // Get modules for this course
    const modulesResult = await query(
        'SELECT id, courseId, title, content, orderIndex FROM Modules WHERE courseId = @id ORDER BY orderIndex',
        { id }
    );

    course.modules = modulesResult.recordset;

    // Get user progress if authenticated
    if (userId) {
        const progressResult = await query(
            'SELECT progress, lastVisited FROM UserCourses WHERE userId = @userId AND courseId = @courseId',
            { userId, courseId: id }
        );

        if (progressResult.recordset.length > 0) {
            course.userProgress = progressResult.recordset[0];
        }
    }

    res.json({
        success: true,
        data: { course }
    });
});

/**
 * Create a new course
 * POST /api/courses
 * Protected route - requires authentication
 */
const createCourse = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { title, description, tags } = req.body;
    const tagsArray = tags || [];

    const result = await query(
        `INSERT INTO Courses (title, description, tags)
     OUTPUT INSERTED.id, INSERTED.title, INSERTED.description, INSERTED.tags, INSERTED.createdAt
     VALUES (@title, @description, @tags)`,
        {
            title,
            description,
            tags: JSON.stringify(tagsArray)
        }
    );

    const course = result.recordset[0];
    course.tags = JSON.parse(course.tags);

    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: { course }
    });
});

/**
 * Update a course
 * PUT /api/courses/:id
 * Protected route - requires authentication
 */
const updateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    // Check if course exists
    const existingCourse = await query(
        'SELECT id FROM Courses WHERE id = @id',
        { id }
    );

    if (existingCourse.recordset.length === 0) {
        return next(new AppError('Course not found', 404));
    }

    // Build update query dynamically
    const updates = [];
    const params = { id };

    if (title) {
        updates.push('title = @title');
        params.title = title;
    }
    if (description) {
        updates.push('description = @description');
        params.description = description;
    }
    if (tags) {
        updates.push('tags = @tags');
        params.tags = JSON.stringify(tags);
    }

    if (updates.length === 0) {
        return next(new AppError('No fields to update', 400));
    }

    const sqlQuery = `
    UPDATE Courses 
    SET ${updates.join(', ')}
    OUTPUT INSERTED.id, INSERTED.title, INSERTED.description, INSERTED.tags
    WHERE id = @id
  `;

    const result = await query(sqlQuery, params);
    const course = result.recordset[0];
    course.tags = course.tags ? JSON.parse(course.tags) : [];

    res.json({
        success: true,
        message: 'Course updated successfully',
        data: { course }
    });
});

/**
 * Delete a course
 * DELETE /api/courses/:id
 * Protected route - requires authentication
 */
const deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await query(
        'SELECT id FROM Courses WHERE id = @id',
        { id }
    );

    if (existingCourse.recordset.length === 0) {
        return next(new AppError('Course not found', 404));
    }

    // Delete course (cascade will handle modules)
    await query('DELETE FROM Courses WHERE id = @id', { id });

    res.json({
        success: true,
        message: 'Course deleted successfully'
    });
});

/**
 * Get personalized course recommendations
 * GET /api/courses/recommendations
 * Protected route - requires authentication
 */
const getRecommendations = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // Get user preferences
    const userResult = await query(
        'SELECT preferences FROM Users WHERE id = @userId',
        { userId }
    );

    if (userResult.recordset.length === 0) {
        return next(new AppError('User not found', 404));
    }

    const preferences = userResult.recordset[0].preferences
        ? JSON.parse(userResult.recordset[0].preferences)
        : { interests: [], difficulty: 'beginner' };

    // Get user's enrolled courses
    const enrolledResult = await query(
        'SELECT courseId FROM UserCourses WHERE userId = @userId',
        { userId }
    );

    const enrolledCourseIds = enrolledResult.recordset.map(row => row.courseId);

    // Build recommendation query based on user preferences
    let sqlQuery = `
    SELECT TOP 10 c.id, c.title, c.description, c.tags, c.createdAt,
           COUNT(uc.userId) as enrolledCount
    FROM Courses c
    LEFT JOIN UserCourses uc ON c.id = uc.courseId
    WHERE 1=1
  `;

    const params = {};

    // Exclude already enrolled courses
    if (enrolledCourseIds.length > 0) {
        sqlQuery += ` AND c.id NOT IN (${enrolledCourseIds.map((_, i) => `@exclude${i}`).join(',')})`;
        enrolledCourseIds.forEach((id, i) => {
            params[`exclude${i}`] = id;
        });
    }

    // Match user interests/tags
    if (preferences.interests && preferences.interests.length > 0) {
        sqlQuery += ' AND (';
        preferences.interests.forEach((interest, index) => {
            if (index > 0) sqlQuery += ' OR ';
            sqlQuery += `c.tags LIKE @interest${index}`;
            params[`interest${index}`] = `%${interest}%`;
        });
        sqlQuery += ')';
    }

    sqlQuery += ' GROUP BY c.id, c.title, c.description, c.tags, c.createdAt';
    sqlQuery += ' ORDER BY enrolledCount DESC, c.createdAt DESC';

    const result = await query(sqlQuery, params);

    const recommendations = result.recordset.map(course => ({
        ...course,
        tags: course.tags ? JSON.parse(course.tags) : []
    }));

    res.json({
        success: true,
        count: recommendations.length,
        data: { recommendations }
    });
});

/**
 * Enroll in a course
 * POST /api/courses/:id/enroll
 * Protected route - requires authentication
 */
const enrollCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const courseResult = await query(
        'SELECT id FROM Courses WHERE id = @id',
        { id }
    );

    if (courseResult.recordset.length === 0) {
        return next(new AppError('Course not found', 404));
    }

    // Check if already enrolled
    const existingEnrollment = await query(
        'SELECT id FROM UserCourses WHERE userId = @userId AND courseId = @courseId',
        { userId, courseId: id }
    );

    if (existingEnrollment.recordset.length > 0) {
        return next(new AppError('Already enrolled in this course', 400));
    }

    // Create enrollment
    await query(
        `INSERT INTO UserCourses (userId, courseId, progress, lastVisited)
     VALUES (@userId, @courseId, @progress, GETDATE())`,
        {
            userId,
            courseId: id,
            progress: 0
        }
    );

    res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course'
    });
});

/**
 * Update course progress
 * PUT /api/courses/:id/progress
 * Protected route - requires authentication
 */
const updateProgress = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
        return next(new AppError('Progress must be between 0 and 100', 400));
    }

    // Update or create progress
    await query(
        `MERGE UserCourses AS target
     USING (SELECT @userId AS userId, @courseId AS courseId) AS source
     ON target.userId = source.userId AND target.courseId = source.courseId
     WHEN MATCHED THEN
       UPDATE SET progress = @progress, lastVisited = GETDATE()
     WHEN NOT MATCHED THEN
       INSERT (userId, courseId, progress, lastVisited)
       VALUES (@userId, @courseId, @progress, GETDATE());`,
        {
            userId,
            courseId: id,
            progress
        }
    );

    res.json({
        success: true,
        message: 'Progress updated successfully'
    });
});

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getRecommendations,
    enrollCourse,
    updateProgress
};

