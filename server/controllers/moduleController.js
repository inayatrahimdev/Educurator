/**
 * Module Controller
 * Handles CRUD operations for course modules
 */

const { query } = require('../db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

/**
 * Create a new module for a course
 * POST /api/courses/:courseId/modules
 * Protected route - requires authentication
 */
const createModule = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { courseId } = req.params;
    const { title, content, orderIndex } = req.body;

    // Check if course exists
    const courseResult = await query(
        'SELECT id FROM Courses WHERE id = @courseId',
        { courseId }
    );

    if (courseResult.recordset.length === 0) {
        return next(new AppError('Course not found', 404));
    }

    // Get max order index if not provided
    let moduleOrderIndex = orderIndex;
    if (moduleOrderIndex === undefined) {
        const maxOrderResult = await query(
            'SELECT ISNULL(MAX(orderIndex), 0) + 1 AS nextIndex FROM Modules WHERE courseId = @courseId',
            { courseId }
        );
        moduleOrderIndex = maxOrderResult.recordset[0].nextIndex;
    }

    // Create module
    const result = await query(
        `INSERT INTO Modules (courseId, title, content, orderIndex)
     OUTPUT INSERTED.id, INSERTED.courseId, INSERTED.title, INSERTED.content, INSERTED.orderIndex
     VALUES (@courseId, @title, @content, @orderIndex)`,
        {
            courseId,
            title,
            content,
            orderIndex: moduleOrderIndex
        }
    );

    const module = result.recordset[0];

    res.status(201).json({
        success: true,
        message: 'Module created successfully',
        data: { module }
    });
});

/**
 * Update a module
 * PUT /api/modules/:id
 * Protected route - requires authentication
 */
const updateModule = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, orderIndex } = req.body;

    // Check if module exists
    const existingModule = await query(
        'SELECT id FROM Modules WHERE id = @id',
        { id }
    );

    if (existingModule.recordset.length === 0) {
        return next(new AppError('Module not found', 404));
    }

    // Build update query dynamically
    const updates = [];
    const params = { id };

    if (title) {
        updates.push('title = @title');
        params.title = title;
    }
    if (content) {
        updates.push('content = @content');
        params.content = content;
    }
    if (orderIndex !== undefined) {
        updates.push('orderIndex = @orderIndex');
        params.orderIndex = orderIndex;
    }

    if (updates.length === 0) {
        return next(new AppError('No fields to update', 400));
    }

    const sqlQuery = `
    UPDATE Modules 
    SET ${updates.join(', ')}
    OUTPUT INSERTED.id, INSERTED.courseId, INSERTED.title, INSERTED.content, INSERTED.orderIndex
    WHERE id = @id
  `;

    const result = await query(sqlQuery, params);
    const module = result.recordset[0];

    res.json({
        success: true,
        message: 'Module updated successfully',
        data: { module }
    });
});

/**
 * Delete a module
 * DELETE /api/modules/:id
 * Protected route - requires authentication
 */
const deleteModule = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if module exists
    const existingModule = await query(
        'SELECT id FROM Modules WHERE id = @id',
        { id }
    );

    if (existingModule.recordset.length === 0) {
        return next(new AppError('Module not found', 404));
    }

    // Delete module
    await query('DELETE FROM Modules WHERE id = @id', { id });

    res.json({
        success: true,
        message: 'Module deleted successfully'
    });
});

module.exports = {
    createModule,
    updateModule,
    deleteModule
};

