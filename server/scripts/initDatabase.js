/**
 * Database Initialization Script
 * Creates the Educurator database and all required tables
 * Run this script once to set up your database
 * 
 * Usage: node scripts/initDatabase.js
 */

const sql = require('mssql');
require('dotenv').config();

// Detect if we're using Azure SQL Database
const isAzure = process.env.AZURE_SQL === 'true' || process.env.DB_SERVER?.includes('.database.windows.net');

// Database configuration (without database name initially)
const getConfig = (databaseName = 'master') => ({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: databaseName,
    options: {
        encrypt: isAzure ? true : (process.env.DB_ENCRYPT === 'true'),
        trustServerCertificate: !isAzure,
        enableArithAbort: true,
        instanceName: process.env.DB_INSTANCE || '',
        ...(isAzure && {
            requestTimeout: 30000,
            connectionTimeout: 30000
        })
    },
    pool: {
        max: isAzure ? 20 : 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
});

const DB_NAME = process.env.DB_NAME || 'Educurator';

/**
 * Create the database if it doesn't exist
 */
async function createDatabase() {
    console.log('🔧 Step 1: Creating database...');

    try {
        const pool = await sql.connect(getConfig('master'));

        // Check if database exists
        const checkDbResult = await pool.request().query(`
            SELECT name FROM sys.databases WHERE name = '${DB_NAME}'
        `);

        if (checkDbResult.recordset.length > 0) {
            console.log(`✅ Database '${DB_NAME}' already exists. Skipping creation.`);
            await pool.close();
            return true;
        }

        // Create database
        await pool.request().query(`CREATE DATABASE [${DB_NAME}]`);
        console.log(`✅ Database '${DB_NAME}' created successfully!`);

        await pool.close();
        return true;
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    }
}

/**
 * Create all tables in the database
 */
async function createTables() {
    console.log('🔧 Step 2: Creating tables...');

    try {
        const pool = await sql.connect(getConfig(DB_NAME));
        const request = pool.request();

        // Users Table
        console.log('   Creating Users table...');
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
            BEGIN
                CREATE TABLE Users (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    name NVARCHAR(100) NOT NULL,
                    email NVARCHAR(255) NOT NULL UNIQUE,
                    password NVARCHAR(255) NOT NULL,
                    preferences NVARCHAR(MAX),
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    updatedAt DATETIME2 DEFAULT GETDATE()
                );
                CREATE INDEX IX_Users_Email ON Users(email);
                PRINT 'Users table created successfully';
            END
            ELSE
                PRINT 'Users table already exists';
        `);

        // Courses Table
        console.log('   Creating Courses table...');
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Courses]') AND type in (N'U'))
            BEGIN
                CREATE TABLE Courses (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    title NVARCHAR(200) NOT NULL,
                    description NVARCHAR(MAX),
                    tags NVARCHAR(MAX),
                    category NVARCHAR(100),
                    difficulty NVARCHAR(20) DEFAULT 'beginner',
                    duration NVARCHAR(50),
                    careerOpportunities NVARCHAR(MAX),
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    updatedAt DATETIME2 DEFAULT GETDATE()
                );
                CREATE INDEX IX_Courses_Category ON Courses(category);
                CREATE INDEX IX_Courses_Difficulty ON Courses(difficulty);
                PRINT 'Courses table created successfully';
            END
            ELSE
                PRINT 'Courses table already exists';
        `);

        // Modules Table
        console.log('   Creating Modules table...');
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Modules]') AND type in (N'U'))
            BEGIN
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
                CREATE INDEX IX_Modules_CourseId ON Modules(courseId);
                PRINT 'Modules table created successfully';
            END
            ELSE
                PRINT 'Modules table already exists';
        `);

        // UserCourses Table
        console.log('   Creating UserCourses table...');
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserCourses]') AND type in (N'U'))
            BEGIN
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
                CREATE INDEX IX_UserCourses_UserId ON UserCourses(userId);
                CREATE INDEX IX_UserCourses_CourseId ON UserCourses(courseId);
                PRINT 'UserCourses table created successfully';
            END
            ELSE
                PRINT 'UserCourses table already exists';
        `);

        // Notifications Table
        console.log('   Creating Notifications table...');
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
            BEGIN
                CREATE TABLE Notifications (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    userId INT NOT NULL,
                    message NVARCHAR(500) NOT NULL,
                    status NVARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
                );
                CREATE INDEX IX_Notifications_UserId ON Notifications(userId);
                CREATE INDEX IX_Notifications_Status ON Notifications(status);
                PRINT 'Notifications table created successfully';
            END
            ELSE
                PRINT 'Notifications table already exists';
        `);

        await pool.close();
        console.log('✅ All tables created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        throw error;
    }
}

/**
 * Insert sample data
 */
async function insertSampleData() {
    console.log('🔧 Step 3: Inserting sample data...');

    try {
        const pool = await sql.connect(getConfig(DB_NAME));
        const request = pool.request();

        // Check if courses already exist
        const checkCourses = await request.query('SELECT COUNT(*) as count FROM Courses');
        if (checkCourses.recordset[0].count > 0) {
            console.log('✅ Sample data already exists. Skipping insertion.');
            await pool.close();
            return;
        }

        // Insert comprehensive courses
        console.log('   Inserting comprehensive courses...');
        try {
            const comprehensiveCourses = require('../data/comprehensiveCourses');
            
            for (const course of comprehensiveCourses) {
                await request.query(`
                    INSERT INTO Courses (title, description, tags, category, difficulty, duration, careerOpportunities)
                    VALUES (@title, @description, @tags, @category, @difficulty, @duration, @careerOpportunities)
                `, {
                    title: course.title,
                    description: course.description,
                    tags: typeof course.tags === 'string' ? course.tags : JSON.stringify(course.tags),
                    category: course.category,
                    difficulty: course.difficulty,
                    duration: course.duration,
                    careerOpportunities: typeof course.careerOpportunities === 'string' 
                        ? course.careerOpportunities 
                        : JSON.stringify(course.careerOpportunities || [])
                });
            }
            
            console.log(`   ✅ Inserted ${comprehensiveCourses.length} comprehensive courses!`);
        } catch (error) {
            console.error('   ⚠️  Error inserting comprehensive courses:', error.message);
            console.log('   Continuing with basic sample data...');
            
            // Fallback to basic sample data
            await request.query(`
                INSERT INTO Courses (title, description, tags) VALUES
                ('Introduction to Web Development', 'Learn the basics of web development including HTML, CSS, and JavaScript', '["web", "html", "css", "javascript", "beginner"]'),
                ('Advanced React Development', 'Master React with hooks, context API, and advanced patterns', '["react", "javascript", "frontend", "intermediate"]'),
                ('Node.js Backend Development', 'Build scalable backend applications with Node.js and Express', '["nodejs", "backend", "express", "api", "intermediate"]');
            `);
        }

        // Insert sample modules for Course 1
        console.log('   Inserting sample modules...');
        await request.query(`
            INSERT INTO Modules (courseId, title, content, orderIndex) VALUES
            (1, 'HTML Basics', 'Learn the fundamentals of HTML structure and semantic markup', 1),
            (1, 'CSS Styling', 'Master CSS for beautiful and responsive web designs', 2),
            (1, 'JavaScript Fundamentals', 'Understand JavaScript variables, functions, and DOM manipulation', 3);
        `);

        // Insert sample modules for Course 2
        await request.query(`
            INSERT INTO Modules (courseId, title, content, orderIndex) VALUES
            (2, 'React Components', 'Learn how to create and compose React components', 1),
            (2, 'Hooks and State Management', 'Master React hooks and state management patterns', 2),
            (2, 'Advanced Patterns', 'Explore advanced React patterns and best practices', 3);
        `);

        await pool.close();
        console.log('✅ Sample data inserted successfully!');
    } catch (error) {
        console.error('❌ Error inserting sample data:', error.message);
        // Don't throw - sample data is optional
        console.log('⚠️  Continuing without sample data...');
    }
}

/**
 * Main initialization function
 */
async function initializeDatabase() {
    console.log('🚀 Starting database initialization...\n');
    console.log(`📊 Database: ${DB_NAME}`);
    console.log(`🖥️  Server: ${process.env.DB_SERVER}`);
    console.log(`👤 User: ${process.env.DB_USER}\n`);

    try {
        // Validate environment variables
        if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_SERVER) {
            throw new Error('Missing required environment variables: DB_USER, DB_PASS, DB_SERVER');
        }

        // Step 1: Create database
        await createDatabase();

        // Step 2: Create tables
        await createTables();

        // Step 3: Insert sample data (optional)
        await insertSampleData();

        console.log('\n✅ Database initialization completed successfully!');
        console.log('🎉 Your database is ready to use!\n');

    } catch (error) {
        console.error('\n❌ Database initialization failed:');
        console.error(error.message);
        console.error('\n💡 Please check:');
        console.error('   1. SQL Server is running');
        console.error('   2. Database credentials in .env file are correct');
        console.error('   3. SQL Server Authentication is enabled');
        console.error('   4. TCP/IP protocol is enabled in SQL Server Configuration Manager\n');
        process.exit(1);
    }
}

// Run initialization
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase, createDatabase, createTables, insertSampleData };
