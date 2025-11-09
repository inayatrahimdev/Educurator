-- Educurator Database Schema
-- MSSQL Server Database Creation Script

-- Create Database (run this separately if database doesn't exist)
-- CREATE DATABASE Educurator;
-- GO
-- USE Educurator;
-- GO

-- Users Table
-- Stores user account information
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    preferences NVARCHAR(MAX), -- JSON format: {"interests": [], "difficulty": "beginner", "language": "en"}
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Courses Table
-- Stores course information
CREATE TABLE Courses (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    tags NVARCHAR(MAX), -- JSON format: ["tag1", "tag2"]
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Modules Table
-- Stores course modules/lessons
CREATE TABLE Modules (
    id INT PRIMARY KEY IDENTITY(1,1),
    courseId INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX),
    orderIndex INT NOT NULL DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE
);
GO

-- UserCourses Table
-- Tracks user enrollment and progress in courses
CREATE TABLE UserCourses (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    courseId INT NOT NULL,
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    lastVisited DATETIME2 DEFAULT GETDATE(),
    enrolledAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId)
);
GO

-- Notifications Table
-- Stores user notifications
CREATE TABLE Notifications (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    message NVARCHAR(500) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- Create Indexes for better query performance
CREATE INDEX IX_Users_Email ON Users(email);
-- Note: Cannot create index on NVARCHAR(MAX) columns (tags, description)
-- Tags will be searched using LIKE queries
CREATE INDEX IX_Modules_CourseId ON Modules(courseId);
CREATE INDEX IX_UserCourses_UserId ON UserCourses(userId);
CREATE INDEX IX_UserCourses_CourseId ON UserCourses(courseId);
CREATE INDEX IX_Notifications_UserId ON Notifications(userId);
CREATE INDEX IX_Notifications_Status ON Notifications(status);
GO

-- Insert Sample Data (Optional)
-- Sample Courses
INSERT INTO Courses (title, description, tags) VALUES
('Introduction to Web Development', 'Learn the basics of web development including HTML, CSS, and JavaScript', '["web", "html", "css", "javascript", "beginner"]'),
('Advanced React Development', 'Master React with hooks, context API, and advanced patterns', '["react", "javascript", "frontend", "intermediate"]'),
('Node.js Backend Development', 'Build scalable backend applications with Node.js and Express', '["nodejs", "backend", "express", "api", "intermediate"]'),
('Database Design and SQL', 'Learn database design principles and SQL query optimization', '["database", "sql", "design", "beginner"]'),
('Machine Learning Fundamentals', 'Introduction to machine learning concepts and algorithms', '["ml", "ai", "python", "data-science", "intermediate"]');
GO

-- Sample Modules for Course 1
INSERT INTO Modules (courseId, title, content, orderIndex) VALUES
(1, 'HTML Basics', 'Learn the fundamentals of HTML structure and semantic markup', 1),
(1, 'CSS Styling', 'Master CSS for beautiful and responsive web designs', 2),
(1, 'JavaScript Fundamentals', 'Understand JavaScript variables, functions, and DOM manipulation', 3);
GO

-- Sample Modules for Course 2
INSERT INTO Modules (courseId, title, content, orderIndex) VALUES
(2, 'React Components', 'Learn how to create and compose React components', 1),
(2, 'Hooks and State Management', 'Master React hooks and state management patterns', 2),
(2, 'Advanced Patterns', 'Explore advanced React patterns and best practices', 3);
GO

