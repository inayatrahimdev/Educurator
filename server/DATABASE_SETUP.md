# Database Setup Guide

This guide will help you set up the Educurator database in your local SQL Server.

## Quick Setup (Automated)

The easiest way to set up the database is using the automated script:

```bash
cd server
npm run init-db
```

Or:

```bash
npm run setup
```

This script will:
1. ✅ Create the `Educurator` database (if it doesn't exist)
2. ✅ Create all required tables (Users, Courses, Modules, UserCourses, Notifications)
3. ✅ Insert sample data (courses and modules)

## Manual Setup (Using SSMS)

If you prefer to set up the database manually using SQL Server Management Studio:

### Step 1: Create the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Right-click on "Databases" and select "New Database"
4. Enter database name: `Educurator`
5. Click "OK"

Or run this SQL command:

```sql
CREATE DATABASE Educurator;
GO
```

### Step 2: Create Tables

1. In SSMS, open the `database/schema.sql` file
2. Select the `Educurator` database in the dropdown
3. Execute the SQL script to create all tables

Or run the schema.sql file directly:

```sql
USE Educurator;
GO

-- Copy and paste the contents of database/schema.sql
```

## Verify Database Setup

After running the setup script, verify that everything was created correctly:

### Option 1: Using SSMS

1. Open SSMS
2. Expand the `Educurator` database
3. Expand "Tables"
4. You should see these tables:
   - Users
   - Courses
   - Modules
   - UserCourses
   - Notifications

### Option 2: Using SQL Query

Run this query in SSMS:

```sql
USE Educurator;
GO

-- Check tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- Check sample data
SELECT COUNT(*) as CourseCount FROM Courses;
SELECT COUNT(*) as ModuleCount FROM Modules;
```

## Troubleshooting

### Error: Cannot connect to SQL Server

**Solution:**
1. Ensure SQL Server is running
2. Check that SQL Server Authentication is enabled
3. Verify your credentials in `.env` file:
   ```
   DB_USER=sa
   DB_PASS=your_password
   DB_SERVER=your_server_name
   DB_NAME=Educurator
   ```

### Error: Database already exists

**Solution:**
- This is not an error! The script will skip database creation if it already exists
- If you want to recreate the database, drop it first in SSMS:
  ```sql
  DROP DATABASE Educurator;
  ```

### Error: Login failed for user

**Solution:**
1. Check your SQL Server Authentication mode
2. Ensure the user has permissions to create databases
3. Try using Windows Authentication if SQL Server Authentication doesn't work

### Error: TCP/IP protocol not enabled

**Solution:**
1. Open SQL Server Configuration Manager
2. Go to SQL Server Network Configuration
3. Enable TCP/IP protocol
4. Restart SQL Server service

## Database Schema

The database includes the following tables:

- **Users**: User accounts with authentication
- **Courses**: Course information
- **Modules**: Course modules/lessons
- **UserCourses**: User enrollment and progress tracking
- **Notifications**: User notifications

## Sample Data

The setup script inserts sample data:
- 5 sample courses
- 6 sample modules (for courses 1 and 2)

You can add more data through the application or directly in the database.

## Next Steps

After setting up the database:

1. ✅ Start the backend server: `npm start`
2. ✅ Start the frontend client: `cd ../client && npm start`
3. ✅ Test the application by registering a new user

## Support

If you encounter any issues, check:
1. SQL Server is running
2. `.env` file has correct credentials
3. SQL Server Authentication is enabled
4. TCP/IP protocol is enabled

For more help, check the main README.md file.

